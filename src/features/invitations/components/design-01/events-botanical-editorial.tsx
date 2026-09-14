import { InvitationEvents } from "../invitation-events";

type Event = {
  id: string;
  name: string;
  date: Date;
  location: string | null;
  address: string | null;
  mapsUrl: string | null;
};

type Props = {
  events: Event[];
};

export function EventsBotanicalEditorial({ events }: Props) {
  return (
    <div className="bg-[#FDF6DC]">
      <InvitationEvents events={events} />
    </div>
  );
}
