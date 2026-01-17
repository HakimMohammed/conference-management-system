package com.conference.analytics.controller;

import com.conference.analytics.model.ReviewStats;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.state.KeyValueIterator;
import org.apache.kafka.streams.state.QueryableStoreTypes;
import org.apache.kafka.streams.state.ReadOnlyWindowStore;
import org.springframework.kafka.config.StreamsBuilderFactoryBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final StreamsBuilderFactoryBean factoryBean;

    public AnalyticsController(StreamsBuilderFactoryBean factoryBean) {
        this.factoryBean = factoryBean;
    }

    @GetMapping("/reviews/window")
    public List<ReviewStats> getReviewStats() {
        List<ReviewStats> stats = new ArrayList<>();
        ReadOnlyWindowStore<String, ReviewStats> store = factoryBean.getKafkaStreams()
                .store("review-stats-store", QueryableStoreTypes.windowStore());

        Instant now = Instant.now();
        Instant from = now.minusSeconds(30);

        try (KeyValueIterator<org.apache.kafka.streams.kstream.Windowed<String>, ReviewStats> iterator = store.fetchAll(from, now)) {
            while (iterator.hasNext()) {
                KeyValue<org.apache.kafka.streams.kstream.Windowed<String>, ReviewStats> next = iterator.next();
                ReviewStats currentStats = next.value;
                currentStats.setAverageStars( (double) currentStats.getTotalStars() / currentStats.getCount());
                currentStats.setWindowStart(next.key.window().startTime());
                currentStats.setWindowEnd(next.key.window().endTime());
                stats.add(currentStats);
            }
        }
        return stats;
    }
}
