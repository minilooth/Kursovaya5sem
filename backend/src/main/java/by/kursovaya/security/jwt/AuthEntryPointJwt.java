package by.kursovaya.security.jwt;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);
    
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        logger.error("Unauthorized error: {}", authException.getMessage());

        if (authException instanceof BadCredentialsException) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Ошибка: Неверный логин или пароль.");
        }
        else if (authException instanceof LockedException) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Ошибка: Аккаунт заблокирован.");
        }
        else if (authException instanceof InsufficientAuthenticationException) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Ошибка: Вы не авторизованы или сессия истекла, пожалуйста авторизуйтесь.");
        }
        else {
            logger.info(authException.getClass().getName());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Ошибка: " + authException.getLocalizedMessage());
        }
    } 
}