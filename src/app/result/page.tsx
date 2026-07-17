import type { Metadata } from "next";
import ResultView from "@/components/result/result-view";

export const metadata: Metadata = {
  title: "ผลลัพธ์ Money Scan — ROOTMAN MONEY ROUTE",
};

export default function ResultPage() {
  return <ResultView />;
}
