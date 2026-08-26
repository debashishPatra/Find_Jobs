package com.labor.registration.dto;

import com.labor.registration.entity.PriceUnit;
import com.labor.registration.entity.Role;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@Data
public class RegisterRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "phone must be a valid 10-digit mobile number")
    private String phone;

    @NotBlank
    @Size(min = 6, message = "password must be at least 6 characters")
    private String password;

    @NotNull
    private Role role; // WORKER or CUSTOMER

    // The following are only required when role == WORKER
    private Long categoryId;
    private BigDecimal price;
    private PriceUnit priceUnit;
    private Integer experienceYears;
    private String location;
    private String description;
}
