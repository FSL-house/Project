package com.campus.config;

import com.campus.interceptor.JwtInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.Resource;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Spring MVC 配置类。
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * JWT 拦截器。
     */
    @Resource
    private JwtInterceptor jwtInterceptor;

    /**
     * 上传文件保存目录。
     */
    @Value("${file.upload-path}")
    private String uploadPath;

    /**
     * 上传文件访问前缀。
     */
    @Value("${file.access-url-prefix}")
    private String accessUrlPrefix;

    /**
     * 注册拦截器。
     * 登录、注册、商品公开查询和图片访问不需要登录。
     *
     * @param registry 拦截器注册器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String normalizedPrefix;
        if (accessUrlPrefix.endsWith("/**")) {
            normalizedPrefix = accessUrlPrefix;
        } else if (accessUrlPrefix.endsWith("/")) {
            normalizedPrefix = accessUrlPrefix + "**";
        } else {
            normalizedPrefix = accessUrlPrefix + "/**";
        }

        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/user/register",
                        "/user/login",
                        "/product/list",
                        "/product/detail/**",
                        "/category/list",
                        normalizedPrefix
                );
    }

    /**
     * 配置跨域。
     * 前后端分离部署时，允许不同域名或端口访问后端接口。
     *
     * @param registry 跨域注册器
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    /**
     * 配置图片静态资源映射。
     * 让保存在服务器磁盘里的图片，可以通过 /uploads/** 直接访问。
     *
     * @param registry 资源处理器注册器
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String normalizedPrefix = accessUrlPrefix.endsWith("/") ? accessUrlPrefix : accessUrlPrefix + "/";
        Path absoluteUploadPath = Paths.get(uploadPath).toAbsolutePath().normalize();

        registry.addResourceHandler(normalizedPrefix + "**")
                .addResourceLocations(absoluteUploadPath.toUri().toString());
    }
}
