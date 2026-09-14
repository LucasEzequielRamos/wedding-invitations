import { InvitationGallery } from "../invitation-gallery";

type GalleryMedia = {
  id: string;
  path: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

type Props = {
  media: GalleryMedia[];
};

export function GalleryBotanicalEditorial({ media }: Props) {
  return (
    <section className="bg-[#FDF6DC] px-6 py-16">
      <div className="mx-auto max-w-[1200px]">
        <InvitationGallery media={media} />
      </div>
    </section>
  );
}
