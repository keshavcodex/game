package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Random;

@RestController
public class DemoController {

    private final Random random = new Random();

    @GetMapping("/")
    public String helloWorld() {
        return "Hello Keshav from Spring Boot and K8s in Minutes!";
    }

    @GetMapping("/random")
    public String randomNumber() {
        return "Here is your random number " + String.valueOf(random.nextInt());
    }
}
