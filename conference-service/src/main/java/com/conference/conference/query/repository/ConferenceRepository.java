package com.conference.conference.query.repository;

import com.conference.conference.query.entity.Conference;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConferenceRepository extends JpaRepository<Conference, String> {
}
