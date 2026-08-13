"""Mocked AWS dependency schemas."""

from datetime import datetime

from pydantic import BaseModel


class IamUser(BaseModel):
    username: str
    arn: str
    user_id: str
    created_at: datetime
    policies: list[str]


class AwsAccount(BaseModel):
    account_id: str
    account_name: str
    email: str
    status: str
    root_user: str


class Organization(BaseModel):
    organization_id: str
    organization_name: str
    management_account_id: str
    feature_set: str


class BillingSummary(BaseModel):
    month: str
    total_charges: float
    currency: str
    services: list[dict]
