import { useEffect, useState } from "react";

import { fetchUser, fetchInsights, fetchCard } from "../services/api";

import { StatsChart } from "../components/StatsChart";
import { ContestData } from "../components/Contests";
import { RecentActivity } from "../components/RecentActivity";
import { TagProblemCounts } from "../components/TagProblemCounts";
import { Languages } from "../components/Languages";
import { AIInsights } from "../components/AIInsights";
import { PlayerCard } from "../components/PlayerCard";

export default function Dashboard() {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [username, setUsername] =
    useState("");

  const [insights, setInsights] =
    useState(null);

  const [loadingInsights, setLoadingInsights] =
    useState(false);

  const [card, setCard] = useState(null);

  const [loadingCard, setLoadingCard] =
    useState(false);



  const loadUser = async () => {
    if (!username.trim()) return;

    try {
      setLoading(true);

      const res = await fetchUser(username);
      setData(res.data);
      setInsights(null);
      setCard(null);

    } catch (err) {
      console.error(err);

    } finally {
      setLoading(false);
    }
  };


  const generateInsights = async () => {
    try {
      setLoadingInsights(true);

      const result = await fetchInsights(data);

      setInsights(result);

    } catch (error) {
      console.error(error);

    } finally {
      setLoadingInsights(false);
    }
  };

  const generateCard = async () => {
    try {
      setLoadingCard(true);

      const result = await fetchCard(data);

      setCard(result);

    } catch (error) {
      console.error(error);

    } finally {
      setLoadingCard(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 text-xl">Loading...</div>;
  }
  if (!data && !loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex gap-2 mb-8">
            <input
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="border px-4 py-3 rounded-xl w-full shadow-sm"
              placeholder="Enter LeetCode username"
            />

            <button
              onClick={loadUser}
              className="bg-black text-white px-6 py-3 rounded-xl"
            >
              Search
            </button>
          </div>

          <div className="text-center text-gray-500 mt-20 text-xl">
            Search for a LeetCode user
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* Search Bar */}
        <div className="flex gap-2 mb-8">
          <input
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="border px-4 py-3 rounded-xl w-full shadow-sm"
            placeholder="Enter LeetCode username"
          />

          <button
            onClick={loadUser}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Search
          </button>
        </div>


        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">

          <div className="flex flex-col md:flex-row items-center gap-6">

            <img
              src={
                data?.profile?.profile?.userAvatar
              }
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-gray-200"
            />

            <div>
              <h1 className="text-4xl font-bold">
                {data?.profile?.username}
              </h1>

              <p className="text-gray-500 mt-2">
                Rank #
                {
                  data?.profile?.profile?.ranking
                }
              </p>

              <p className="text-gray-500">
                {
                  data?.profile?.profile?.countryName
                }
              </p>

              <p className="text-gray-500">
                {
                  data?.profile?.profile?.school
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
              Problem Stats
            </h2>

            <StatsChart data={data} />
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
              Contest Data
            </h2>

            <ContestData data={data} />
          </div>

          <div className="bg-white rounded-2xl shadow p-6">


            <RecentActivity data={data} />
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
              Languages
            </h2>

            <Languages data={data} />
          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Topic Coverage
          </h2>

          <TagProblemCounts data={data} />
        </div>

        <div className="flex justify-center gap-4 mt-10 flex-wrap">
          <button
            onClick={generateInsights}
            disabled={loadingInsights}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition"
          >
            {loadingInsights
              ? "Analyzing..."
              : "Generate Tips"}
          </button>

          <button
            onClick={generateCard}
            disabled={loadingCard}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition"
          >
            {loadingCard
              ? "Building card..."
              : "🃏 Generate Player Card"}
          </button>
        </div>

        {insights && (
          <div className="mt-10">
            <AIInsights insights={insights} />
          </div>
        )}

        {card && (
          <div className="mt-10">
            <PlayerCard card={card} />
          </div>
        )}

      </div>
    </div>
  );
}