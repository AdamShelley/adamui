import SearchBar from "../../src/components/search-bar/search-bar";

type TimelineDataProps = Array<{
  id: number;
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
    id: 1,
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
    id: 2,
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
    <div className="min-h-screen p-8 flex flex-col w-screen gap-4">
      <h1 className="text-3xl font-bold mb-8 text-center">ADAMUI</h1>

      <h2 className="text-2xl font-bold mb-4">Search Bar</h2>
      <section className="w-full flex justify-center gap-2">
        <div className="flex flex-col align-center gap-4">
          <span>Standard</span>
          <SearchBar />
          <span>Always Open</span>
          <SearchBar alwaysOpen />
          <span>Autocomplete Dropdown</span>
          <SearchBar autoComplete />
        </div>
      </section>

      {/* <h2 className="text-2xl font-bold mb-4">Timeline</h2> */}
      {/* <section className="w-full flex justify-center ">
        <Timeline orientation="vertical" className="mt-10 ">
          {exampleTimelineData.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </Timeline>
      </section> */}
    </div>
  );
}

export default App;
