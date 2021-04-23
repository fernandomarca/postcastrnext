import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import { api } from "./api";
type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  published_at: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  };
};

export async function getEpisodes() {
  const { data } = await api.get<Episode[]>("/episodes", {
    params: {
      _limit: 12,
      _sort: "published",
      _order: "desc",
    },
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: episode.file.duration,
      durationAsString: convertDurationToTimeString(episode.file.duration),
      description: episode.description,
      url: episode.file.url,
    };
  });

  return episodes;
}
