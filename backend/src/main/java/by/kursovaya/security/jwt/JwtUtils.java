package by.kursovaya.security.jwt;

import java.util.Date;

import by.kursovaya.security.services.UserDetailsImpl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    
    @Value("${springsecuritytest.app.jwtSecret}")
    private String jwtSecret;

    @Value("${springsecuritytest.app.jwtExpirationMs}")
    private Integer jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userDetailsImpl = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
            .setSubject((userDetailsImpl.getUsername()))
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public Boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        }
        catch (SignatureException ex) {
            logger.error("Invalid JWT signature: {}", ex.getMessage());
        }
        catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token: {}", ex.getMessage());
        }
        catch (ExpiredJwtException ex) {
            logger.error("JWT token is expired: {}", ex.getMessage());
        }
        catch (UnsupportedJwtException ex) {
            logger.error("JWT token is unsupported: {}", ex.getMessage());
        }
        catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty: {}", ex.getMessage());
        }

        return false;
    }
}
