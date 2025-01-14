package com.example.event_service.conf;

import com.example.event_service.model.Event;
import com.example.event_service.model.TYPE;
import com.example.event_service.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.data.RepositoryItemWriter;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.LineMapper;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.transaction.PlatformTransactionManager;

import java.beans.PropertyEditorSupport;
import java.time.LocalDate;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class BatchConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final EventRepository repository;

    @Bean
    public FlatFileItemReader<Event> reader() {
        FlatFileItemReader<Event> itemReader = new FlatFileItemReader<>();
        itemReader.setResource(new FileSystemResource("src/main/resources/events.csv"));
        itemReader.setName("csvReader");
        itemReader.setLinesToSkip(1);
        itemReader.setLineMapper(lineMapper());
        return itemReader;
    }

    @Bean
    public EventProcessor processor() {
        return new EventProcessor();
    }


    @Bean
    public RepositoryItemWriter<Event> writer() {
        RepositoryItemWriter<Event> writer = new RepositoryItemWriter<>();
        writer.setRepository(repository);
        writer.setMethodName("save");
        return writer;
    }

    @Bean
    public Step step1() {
        return new StepBuilder("csvImport", jobRepository)
                .<Event, Event>chunk(1000, platformTransactionManager)
                .reader(reader())
                .processor(processor())
                .writer(writer())
                .taskExecutor(taskExecutor())
                .build();
    }

    @Bean
    public Job runJob() {
        return new JobBuilder("importEvents", jobRepository)
                .start(step1())
                .build();

    }

    @Bean
    public TaskExecutor taskExecutor() {
        SimpleAsyncTaskExecutor asyncTaskExecutor = new SimpleAsyncTaskExecutor();
        asyncTaskExecutor.setConcurrencyLimit(5);
        return asyncTaskExecutor;
    }

    private LineMapper<Event> lineMapper() {
        DefaultLineMapper<Event> lineMapper = new DefaultLineMapper<>();

        // Tokenizer to define the fields separated by commas
        DelimitedLineTokenizer lineTokenizer = new DelimitedLineTokenizer();
        lineTokenizer.setDelimiter(",");
        lineTokenizer.setStrict(false);
        lineTokenizer.setNames("id", "title", "description", "location", "date", "time", "type", "owner");

        // Bean wrapper to map the CSV fields to the Event class
        BeanWrapperFieldSetMapper<Event> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(Event.class);

        // Custom FieldSetMapper to handle LocalDate and TYPE enum conversion
        fieldSetMapper.setCustomEditors(Map.of(
                LocalDate.class, new LocalDateEditor(),  // Custom editor to convert date string to LocalDate
                TYPE.class, new TypeEnumEditor()         // Custom editor to convert string to TYPE enum
        ));

        // Setting the tokenizer and field set mapper
        lineMapper.setLineTokenizer(lineTokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        return lineMapper;
    }

    // Custom editor to handle LocalDate conversion from CSV
    public static class LocalDateEditor extends PropertyEditorSupport {
        @Override
        public void setAsText(String text) throws IllegalArgumentException {
            setValue(LocalDate.parse(text));
        }
    }

    // Custom editor to handle TYPE enum conversion from CSV
    public static class TypeEnumEditor extends PropertyEditorSupport {
        @Override
        public void setAsText(String text) throws IllegalArgumentException {
            setValue(TYPE.valueOf(text.toUpperCase()));  // Convert string to uppercase for enum matching
        }
    }
}
