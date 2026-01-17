package com.conference.keynote.query.repository;

import com.conference.keynote.query.entity.Keynote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KeynoteRepository extends JpaRepository<Keynote, String> {
}
