package com.example.reactive_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ReactiveGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReactiveGatewayApplication.class, args);
	}

}
