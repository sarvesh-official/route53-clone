"""Mocked AWS dependency endpoints.

These endpoints simulate the AWS console sidebar sections that Route 53 depends
on but are not part of the core DNS management workflow.

  GET /api/aws/iam            mocked IAM user info
  GET /api/aws/account        mocked AWS account info
  GET /api/aws/organizations  mocked Organizations info
  GET /api/aws/billing        mocked billing summary
"""
from fastapi import APIRouter, Depends

from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.aws_mock import AwsAccount, BillingSummary, IamUser, Organization
from app.schemas.common import APIResponse
from app.services import aws_mock_service

router = APIRouter()


@router.get(
    "/iam",
    response_model=APIResponse[IamUser],
    summary="Get mocked IAM user info",
)
def get_iam(user: User = Depends(get_current_user)) -> APIResponse[IamUser]:
    return APIResponse(data=aws_mock_service.get_iam_user())


@router.get(
    "/account",
    response_model=APIResponse[AwsAccount],
    summary="Get mocked AWS account info",
)
def get_account(user: User = Depends(get_current_user)) -> APIResponse[AwsAccount]:
    return APIResponse(data=aws_mock_service.get_account())


@router.get(
    "/organizations",
    response_model=APIResponse[Organization],
    summary="Get mocked Organizations info",
)
def get_organizations(user: User = Depends(get_current_user)) -> APIResponse[Organization]:
    return APIResponse(data=aws_mock_service.get_organization())


@router.get(
    "/billing",
    response_model=APIResponse[BillingSummary],
    summary="Get mocked billing summary",
)
def get_billing(user: User = Depends(get_current_user)) -> APIResponse[BillingSummary]:
    return APIResponse(data=aws_mock_service.get_billing())
