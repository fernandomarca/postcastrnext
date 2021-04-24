import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { getEpisodeBySlug } from "../../services/getEpisodes";

import styles from "../episodes/episodes.module.scss";
import { api } from "../../services/api";
import { usePlayer } from "../../contexts/PlayerContext";
import Head from "next/head";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  // const router = useRouter();

  // if (router.isFallback) {
  //   return <p>Carregando...</p>;
  // }
  const { play } = usePlayer();
  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title}</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="tocar" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get<Episode[]>(`/episodes/`, {
    params: {
      _limit: 2,
      _sort: "published",
      _order: "desc",
    },
  });
  const paths = data.map((episode) => {
    return { params: { slug: episode.id } };
  });
  return {
    paths,
    fallback: "blocking",
    //false: se não encontra a página - retorna 404
    //true: se não encontra a página - tente gerar dinamicamente no Client
    //blocking: Gera no lado do server Nodejs
  };
};
export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const episode = await getEpisodeBySlug(String(slug));
  return {
    props: { episode },
    revalidate: 60 * 60 * 24, //24 hours
  };
};
