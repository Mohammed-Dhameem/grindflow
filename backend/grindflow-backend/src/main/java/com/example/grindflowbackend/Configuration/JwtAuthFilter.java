package com.example.grindflowbackend.Configuration;

import com.example.grindflowbackend.Service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Only try to authenticate if no authentication is already present
        if (SecurityContextHolder.getContext().getAuthentication() == null) {

            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                Arrays.stream(cookies)
                        .filter(cookie ->
                                "jwt".equals(cookie.getName()) ||
                                        "reset_jwt".equals(cookie.getName())
                        )
                        .findFirst()
                        .ifPresent(jwtCookie -> {
                            String token = jwtCookie.getValue();
                            try {
                                if (jwtUtil.isTokenValid(token)) {
                                    String email = jwtUtil.extractEmail(token);

                                    // No authorities — just pass empty list
                                    UsernamePasswordAuthenticationToken auth =
                                            new UsernamePasswordAuthenticationToken(
                                                    email,
                                                    null,
                                                    Collections.emptyList()
                                            );

                                    auth.setDetails(new WebAuthenticationDetailsSource()
                                            .buildDetails(request));
                                    SecurityContextHolder.getContext().setAuthentication(auth);
                                }
                            } catch (Exception e) {
                                // Optional: log invalid token
                            }
                        });
            }
        }

        filterChain.doFilter(request, response);
    }
}
