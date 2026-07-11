package com.makemytrip.makemytrip;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class MakemytripApplication {

	public static void main(String[] args) {
		SpringApplication.run(MakemytripApplication.class, args);
	}

	// 1. Force the client instance to talk to your Atlas Cloud
	@Bean
	public MongoClient mongoClient() {
		return MongoClients.create("mongodb+srv://bhagavathisharma8_db_user:Raya1880@main.zfpdvjl.mongodb.net/");
	}

	// 2. Explicitly tell Spring Data to use 'makemytrip' instead of 'test'
	@Bean
	public MongoTemplate mongoTemplate() {
		return new MongoTemplate(mongoClient(), "makemytrip");
	}
}