"""Authentication endpoints.

Public endpoints (no token required):
  POST /api/auth/login
  POST /api/auth/register

Protected endpoints (Bearer token required):
  POST /api/auth/logout
  GET  /api/auth/me
"""
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_session, get_current_user
from app.models.user import User
from app.models.user_session import UserSession
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserMe
from app.schemas.common import APIResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post(
    "/login",
    response_model=APIResponse[AuthResponse],
    summary="Login with email and password",
)
def login(
    body: LoginRequest,
    db: Session = Depends(get_db),
) -> APIResponse[AuthResponse]:
    service = AuthService(db)
    data = service.login(email=body.email, password=body.password)
    return APIResponse(data=data)


@router.post(
    "/register",
    response_model=APIResponse[AuthResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register a new account",
)
def register(
    body: RegisterRequest,
    db: Session = Depends(get_db),
) -> APIResponse[AuthResponse]:
    service = AuthService(db)
    data = service.register(
        email=body.email,
        password=body.password,
        display_name=body.display_name,
    )
    return APIResponse(data=data)


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Invalidate the current session",
)
def logout(
    db: Session = Depends(get_db),
    session: UserSession = Depends(get_current_session),
) -> Response:
    service = AuthService(db)
    service.logout(session)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/me",
    response_model=APIResponse[UserMe],
    summary="Get the authenticated user's profile",
)
def me(
    current_user: User = Depends(get_current_user),
) -> APIResponse[UserMe]:
    return APIResponse(data=UserMe.model_validate(current_user))
