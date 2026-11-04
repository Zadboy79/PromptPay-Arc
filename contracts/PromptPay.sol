// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title PromptPay
/// @notice Collects a fixed USDC payment for each AI prompt ID unique per payer.
/// @dev Configure the ERC-20 USDC address for the target network. All amounts use
///      USDC's six-decimal base units; payments do not themselves execute AI prompts.
contract PromptPay is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice Maximum prompt price: 100 USDC in six-decimal base units.
    uint256 public constant MAX_PRICE = 100e6;

    /// @notice USDC ERC-20 contract used for payments and withdrawals.
    IERC20 public immutable usdc;

    /// @notice Current price per prompt in USDC base units.
    uint256 public pricePerPrompt;

    /// @notice Whether a payer has paid for a prompt ID; IDs are unique per payer.
    mapping(address payer => mapping(bytes32 promptId => bool paid)) public isPaid;

    /// @notice The USDC address must not be zero.
    error InvalidUSDC();
    /// @notice Prices must be nonzero and must not exceed MAX_PRICE.
    error InvalidPrice(uint256 price);
    /// @notice The zero prompt ID is not allowed.
    error InvalidPromptId();
    /// @notice A prompt ID can only be paid once by each payer.
    error PromptAlreadyPaid(address payer, bytes32 promptId);
    /// @notice The current price exceeds the payer's authorized maximum.
    error PriceExceedsMax(uint256 currentPrice, uint256 maxPrice);
    /// @notice Withdrawals cannot be sent to the zero address.
    error InvalidRecipient();
    /// @notice Ownership renunciation is disabled to preserve withdrawals.
    error RenounceDisabled();

    /// @notice Emitted after USDC is collected for a prompt.
    event PromptPaid(address indexed payer, bytes32 indexed promptId, uint256 amount);
    /// @notice Emitted when the owner updates the prompt price.
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    /// @notice Emitted after the owner withdraws USDC.
    event Withdrawn(address indexed to, uint256 amount);

    /// @notice Initializes the payment token, owner, and prompt price.
    /// @param usdc_ Nonzero ERC-20 USDC address with six-decimal amounts.
    /// @param initialOwner Nonzero owner; validated by OpenZeppelin Ownable.
    /// @param initialPrice Initial price, greater than zero and at most MAX_PRICE.
    constructor(address usdc_, address initialOwner, uint256 initialPrice)
        Ownable(initialOwner)
    {
        if (usdc_ == address(0)) revert InvalidUSDC();
        if (initialPrice == 0 || initialPrice > MAX_PRICE) revert InvalidPrice(initialPrice);

        usdc = IERC20(usdc_);
        pricePerPrompt = initialPrice;
    }

    /// @notice Pays for a nonzero prompt ID not previously paid by the caller.
    /// @dev The caller must first approve this contract to spend sufficient USDC.
    ///      Records the payment before transferring; a failed transfer reverts the record.
    /// @param promptId Identifier for the prompt, unique per payer.
    /// @param maxPrice Maximum acceptable payment in USDC base units.
    function pay(bytes32 promptId, uint256 maxPrice) external nonReentrant {
        if (promptId == bytes32(0)) revert InvalidPromptId();
        if (isPaid[msg.sender][promptId]) revert PromptAlreadyPaid(msg.sender, promptId);

        uint256 amount = pricePerPrompt;
        if (amount > maxPrice) revert PriceExceedsMax(amount, maxPrice);

        isPaid[msg.sender][promptId] = true;
        usdc.safeTransferFrom(msg.sender, address(this), amount);

        emit PromptPaid(msg.sender, promptId, amount);
    }

    /// @notice Updates the price charged for subsequent prompt payments.
    /// @param newPrice New price in USDC base units, within (0, MAX_PRICE].
    function setPrice(uint256 newPrice) external onlyOwner {
        if (newPrice == 0 || newPrice > MAX_PRICE) revert InvalidPrice(newPrice);

        uint256 oldPrice = pricePerPrompt;
        pricePerPrompt = newPrice;

        emit PriceUpdated(oldPrice, newPrice);
    }

    /// @notice Disables ownership renunciation; use the two-step ownership transfer instead.
    function renounceOwnership() public override onlyOwner {
        revert RenounceDisabled();
    }

    /// @notice Withdraws USDC held by this contract to a nonzero recipient.
    /// @param to Address receiving the USDC.
    /// @param amount Amount to withdraw in USDC base units.
    function withdraw(address to, uint256 amount) external onlyOwner nonReentrant {
        if (to == address(0)) revert InvalidRecipient();

        usdc.safeTransfer(to, amount);

        emit Withdrawn(to, amount);
    }
}
