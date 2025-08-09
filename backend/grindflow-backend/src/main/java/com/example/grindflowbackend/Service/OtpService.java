package com.example.grindflowbackend.Service;

import com.example.grindflowbackend.Model.Enum.EnumeratedClass.OtpStatus;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final SecureRandom random = new SecureRandom();
    private final ConcurrentHashMap<String, OtpRecord> store = new ConcurrentHashMap<>();
    private final int otpTtlSeconds = 300; // 5 minutes

    public String generateOtpForEmail(String email) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        store.put(email, new OtpRecord(otp, Instant.now().plusSeconds(otpTtlSeconds)));
        return otp;
    }

    public OtpStatus validateOtp(String email, String otp) {
        final OtpStatus[] status = {OtpStatus.INVALID};

        store.computeIfPresent(email, (key, rec) -> {
            if (Instant.now().isAfter(rec.expiresAt())) {
                status[0] = OtpStatus.EXPIRED;
                return null; // Remove expired
            }
            if (rec.otp().equals(otp)) {
                status[0] = OtpStatus.VALID;
                return null; // Remove on success
            }
            status[0] = OtpStatus.INVALID;
            return rec; // Keep in store if incorrect but still valid
        });

        return status[0];
    }

    private record OtpRecord(String otp, Instant expiresAt) {}
}
