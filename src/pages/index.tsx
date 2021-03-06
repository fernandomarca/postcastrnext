import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "../contexts/PlayerContext";
import { getEpisodes } from "../services/getEpisodes";
import styles from "./home.module.scss";

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

type HomeProps = {
  latestEpisodes: Array<Episode>;
  allEpisodes: Array<Episode>;
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();
  const episodeList = [...latestEpisodes, ...allEpisodes];
  return (
    <>
      <Head>
        <title>Home | PodCastr</title>
      </Head>
      <div className={styles.homepage}>
        <section className={styles.latestEpisodes}>
          <h2>Últimos lançamentos </h2>
          <ul>
            {latestEpisodes.map((episode, index) => {
              return (
                <li key={episode.id}>
                  <div>
                    <Image
                      objectFit="cover"
                      width={192}
                      height={192}
                      src={episode.thumbnail}
                      alt={episode.title}
                    />
                  </div>
                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => playList(episodeList, index)}
                  >
                    <img src="/play-green.svg" alt="tocar" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72, fontSize: 0 }}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          playList(episodeList, index + latestEpisodes.length)
                        }
                      >
                        <img src="/play-green.svg" alt="tocar" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const episodes = await getEpisodes();

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      allEpisodes,
      latestEpisodes,
    },
    revalidate: 60 * 60 * 8, //8 hours
  };
};
