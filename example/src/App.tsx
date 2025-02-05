import { Timeline } from "../../src/components/timeline";

type TimelineDataProps = Array<{
  id: string;
  title: string;
  date: string;
  content: string;
  children: {
    title: string;
    date: string;
    content: string;
  }[];
}>;

const exampleTimelineData: TimelineDataProps = [
  {
    id: "1",
    title: "First item",
    date: "2021-01-01",
    content: "This is the first item",
    children: [
      {
        title: "First child",
        date: "2021-01-02",
        content: "This is the first child",
      },
      {
        title: "Second child",
        date: "2021-01-03",
        content: "This is the second child",
      },
    ],
  },
  {
    id: "2",
    title: "Second item",
    date: "2021-01-04",
    content: "This is the second item",
    children: [
      {
        title: "First child",
        date: "2021-01-05",
        content: "This is the first child",
      },
      {
        title: "Second child",
        date: "2021-01-06",
        content: "This is the second child",
      },
    ],
  },
];

function App() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">ADAMUI Example</h1>
      <Timeline items={exampleTimelineData} />
    </div>
  );
}

export default App;
