package com.conference.analytics.processor;

import com.conference.analytics.model.ReviewStats;
import com.conference.conference.common.event.ReviewAddedEvent;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.kstream.TimeWindows;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafkaStreams;
import org.springframework.kafka.support.serializer.JsonSerde;

import java.time.Duration;

@Configuration
@EnableKafkaStreams
public class ReviewStreamsProcessor {

    @Bean
    public KStream<String, ReviewAddedEvent> process(StreamsBuilder builder) {
        JsonSerde<ReviewAddedEvent> reviewAddedEventSerde = new JsonSerde<>(ReviewAddedEvent.class);
        JsonSerde<ReviewStats> reviewStatsSerde = new JsonSerde<>(ReviewStats.class);

        KStream<String, ReviewAddedEvent> stream = builder.stream("review-events",
                Consumed.with(Serdes.String(), reviewAddedEventSerde));

        stream.groupByKey()
                .windowedBy(TimeWindows.of(Duration.ofSeconds(5)))
                .aggregate(
                        ReviewStats::new,
                        (key, value, aggregate) -> {
                            aggregate.setCount(aggregate.getCount() + 1);
                            aggregate.setTotalStars(aggregate.getTotalStars() + value.getStars());
                            return aggregate;
                        },
                        Materialized.as("review-stats-store")
                );

        return stream;
    }
}
