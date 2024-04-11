// SPDX-License-Identifier: MIT
pragma solidity =0.8.24;

interface IMaximizer {
    // Custom error definitions
    error SignerCannotBeZeroAddress();
    error WETHCannotBeZeroAddress();
    error TokenCannotBeZeroAddress();
    error DepositAmountCannotBeZero();
    error CannotDepositForZeroAddress();
    error TokenNotAllowedForMaximizeYields();
    error WithdrawAmountCannotBeZero();
    error UserDoesNotHaveStake();
    error SignatureInvalid();
    error TokenArrayCannotBeEmpty();
    error SignatureExpired();
    error MigratorBlocked();
    error DuplicateToken();
    error SignerAlreadySetToAddress();
    error TokenAlreadyConfiguredWithState();
    error MigratorCannotBeZeroAddress();
    error MigratorAlreadyAllowedOrBlocked();
    error CannotRenounceOwnership();

    // Event declarations
    event Deposit(
        uint256 indexed eventId,
        address indexed user,
        address token,
        uint256 amount
    );
    event Withdraw(
        uint256 indexed eventId,
        address indexed user,
        address token,
        uint256 amount
    );
    event Migrate(
        uint256 indexed eventId,
        address indexed user,
        address[] tokens,
        address destination,
        address migratorContract,
        uint256[] amounts
    );
    event SignerChanged(address newSigner);
    event TokenStakabilityChanged(address token, bool canStake);
    event BlocklistChanged(address migrator, bool blocklisted);

    // Function declarations
    function depositFor(address _token, address _for, uint256 _amount) external;
    function depositETHFor(address _for) external payable;
    function withdraw(address _token, uint256 _amount) external;
    function migrateWithSig(
        address _user,
        address[] calldata _tokens,
        address _migratorContract,
        address _destination,
        uint256 _signatureExpiry,
        bytes memory _stakerSignature
    ) external;
    function migrate(
        address[] calldata _tokens,
        address _migratorContract,
        address _destination,
        uint256 _signatureExpiry,
        bytes calldata _authorizationSignatureFromZircuit
    ) external;
    function setsecureSigner(address _signer) external;
    function setStakable(address _token, bool _canStake) external;
    function blockMigrator(address _migrator, bool _blocklisted) external;
    function pause() external;
    function unpause() external;
}
