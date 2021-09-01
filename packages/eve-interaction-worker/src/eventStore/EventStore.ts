import {Id} from '../Value/Id';
import {Aggregate} from './Aggregate';
import pool from '../structures/Pool';
import {Event} from '../Value/Event';
import {EventTopic} from '../types';

interface EventsRow {
  [string: string]: string,
  topic: EventTopic,
}

export class EventStore {
  public static async loadAggregate(id: Id): Promise<Aggregate> {
    const sql = 'SELECT correlation_id FROM events WHERE event_id = ?';
    const idResult = await pool.query(sql, id.toString());

    if (idResult[0] === undefined) {
      return null;
    }

    const correlationId = idResult[0]['correlation_id'];

    const result = await pool.query('SELECT * FROM events WHERE correlation_id = ?', correlationId);

    const events = result.map((row: EventsRow) => {
      return Event.fromRow(row);
    });

    return Aggregate.reconstitute(events);
  }

  public static async saveAggregate(aggregate: Aggregate): Promise<void> {
    const events = aggregate.popEvents();

    for (const event of events) {
      if (event.getOccurredOn() !== null) {
        continue;
      }

      await pool.query(
        'INSERT INTO `events` (`event_id`, `causation_id`, `correlation_id`, `topic`, `payload`) VALUES (?, ?, ?, ?, ?);',
        [
          event.getEventId().toString(),
          event.getCausationId().toString(),
          event.getCorrelationId().toString(),
          event.getTopic(),
          JSON.stringify(event.getPayload()),
        ],
      );
    }
  }
}
