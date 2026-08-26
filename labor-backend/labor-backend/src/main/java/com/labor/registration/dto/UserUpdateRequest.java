package com.labor.registration.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Data
public class UserUpdateRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "phone must be a valid 10-digit mobile number")
    private String phone;
}
