"""Mocked AWS dependency data.

These are static mock responses that simulate the AWS console's sidebar sections
for IAM, AWS Accounts, Organizations, and Billing. No real AWS calls are made.
"""

from datetime import UTC, datetime

from app.schemas.aws_mock import AwsAccount, BillingSummary, IamUser, Organization

_MOCK_IAM_USER = IamUser(
    username="demo-user",
    arn="arn:aws:iam::123456789012:user/demo-user",
    user_id="AIDAIOSFODNN7EXAMPLE",
    created_at=datetime(2024, 1, 15, 10, 30, 0, tzinfo=UTC),
    policies=["AmazonRoute53FullAccess", "IAMReadOnlyAccess"],
)

_MOCK_ACCOUNT = AwsAccount(
    account_id="123456789012",
    account_name="Demo Account",
    email="demo@example.com",
    status="ACTIVE",
    root_user="root",
)

_MOCK_ORGANIZATION = Organization(
    organization_id="o-abc123def4",
    organization_name="Demo Organization",
    management_account_id="123456789012",
    feature_set="ALL",
)

_MOCK_BILLING = BillingSummary(
    month="2024-12",
    total_charges=0.42,
    currency="USD",
    services=[
        {"name": "Route 53", "charges": 0.40, "usage": "2 hosted zones"},
        {"name": "IAM", "charges": 0.00, "usage": "1 user"},
        {"name": "Organizations", "charges": 0.00, "usage": "1 organization"},
        {"name": "Other", "charges": 0.02, "usage": "Data transfer"},
    ],
)


def get_iam_user() -> IamUser:
    return _MOCK_IAM_USER


def get_account() -> AwsAccount:
    return _MOCK_ACCOUNT


def get_organization() -> Organization:
    return _MOCK_ORGANIZATION


def get_billing() -> BillingSummary:
    return _MOCK_BILLING
