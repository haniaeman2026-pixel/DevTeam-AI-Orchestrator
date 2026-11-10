from pydantic import BaseModel, Field, field_validator

class WorkflowRequest(BaseModel):
    requirement: str = Field(min_length=20, max_length=6000)

    @field_validator("requirement")
    @classmethod
    def requirement_not_blank(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 20:
            raise ValueError("Please provide a more detailed software requirement (at least 20 characters).")
        return value
