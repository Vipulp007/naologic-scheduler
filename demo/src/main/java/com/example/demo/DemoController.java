package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.List;

@RestController
public class DemoController {
    @GetMapping("/")
    public String getDemo() {
        return "Hello, world!";
    }

    @GetMapping("/users")
    public List<Map<String, Object>> getDemoJson() {
        return List.of(
            Map.of("id", 1, "name", "Vipul"),
            Map.of("id", 2, "name", "John"),
            Map.of("id", 3, "name", "Alice")
        );
    }
}