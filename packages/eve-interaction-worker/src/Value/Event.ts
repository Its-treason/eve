import {Id} from './Id';
import {EventTopic} from '../types';

export class Event {
  private readonly eventId: Id;
  private readonly causationId: Id;
  private readonly correlationId: Id;
  private readonly topic: EventTopic;
  private readonly occurredOn: Date;
  private readonly payload: { [key: string]: string };

  private constructor(
    eventId: Id,
    causationId: Id,
    correlationId: Id,
    topic: EventTopic,
    occurredOn: Date,
    payload: { [key: string]: string },
  ) {
    this.eventId = eventId;
    this.causationId = causationId;
    this.correlationId = correlationId;
    this.topic = topic;
    this.occurredOn = occurredOn;
    this.payload = payload;
  }

  public static fromRow(row: {[string: string]: string, topic: EventTopic}): Event
  {
    return new this(
      Id.fromString(row['event_id']),
      Id.fromString(row['causation_id']),
      Id.fromString(row['correlation_id']),
      row['topic'],
      new Date(row['occurred_on']),
      JSON.parse(row['payload']),
    );
  }

  public static fromValues(
    eventId: Id,
    causationId: Id,
    correlationId: Id,
    topic: EventTopic,
    occurredOn: Date,
    payload: { [key: string]: string },
  ): Event {
    return new this(
      eventId,
      causationId,
      correlationId,
      topic,
      occurredOn,
      payload,
    );
  }

  public getEventId(): Id {
    return this.eventId;
  }

  public getCausationId(): Id {
    return this.causationId;
  }

  public getCorrelationId(): Id {
    return this.correlationId;
  }

  public getTopic(): EventTopic {
    return this.topic;
  }

  public getOccurredOn(): Date {
    return this.occurredOn;
  }

  public getPayload(): { [key: string]: string } {
    return this.payload;
  }
}
