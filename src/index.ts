import express from "express";

const app = express();
const PORT = process.env.PORT || 3003
const jsonBodyParser = express.json();

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

type Range<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

type AgeRange = Range<1, 18>;
const RESOLUTIONS = [
  "P144",
  "P240",
  "P360",
  "P480",
  "P720",
  "P1080",
  "P1440",
  "P2160",
] as const;
type Resolutions = (typeof RESOLUTIONS)[number];
const RESOLUTIONS_STRING = RESOLUTIONS.join(', ')


const isAvailableResolutionsCorrect = (availableResolutions: Resolutions[]) => {
  return availableResolutions.every((res) => RESOLUTIONS.includes(res));
};

interface Video {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: AgeRange | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: Resolutions;
}

let videoList: Video[] = [
  {
    id: +new Date(),
    title: "Hobbit",
    author: "Jackson",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: "P144",
  },
];

app.use(jsonBodyParser);

app.get("/videos", (_req, res) => {
  res.status(200).json(videoList);
});

app.get("/videos/:id", (req, res) => {
  const id = req.params.id

  const found = videoList.find((video) => video.id === +id)

  if (!found) {
    res.status(404)
    return
  }

  res.status(200).json(found)
})

app.post("/videos", (req, res) => {
  const { title, author, availableResolutions } = req.body;
  const errorsMessages = []

  if (!title) {
    errorsMessages.push({ message: 'title is required', field: 'title' })
  }

  if (!author) {
    errorsMessages.push({ message: 'author is required', field: 'author' })

  }

  if (!availableResolutions || !availableResolutions.length) {
    errorsMessages.push({ message: 'availableResolutions is required', field: 'availableResolutions' })
  }

  if (availableResolutions && availableResolutions.length && !isAvailableResolutionsCorrect(availableResolutions)) {
    errorsMessages.push({ message: `availableResolutions has incorrect values, correct types are: ${RESOLUTIONS_STRING}`, field: 'availableResolutions' })
  }

  if (errorsMessages.length) {
    res.status(400).json({errorsMessages})
    return
  }

  const id = +new Date();
  const createdAtDate = new Date();
  const publicationDate = new Date(createdAtDate.getDate() + 1).toISOString();
  const created = {
    title,
    author,
    id,
    availableResolutions,
    createdAt: createdAtDate.toISOString(),
    publicationDate,
    minAgeRestriction: null,
    canBeDownloaded: false,
  };

  videoList.push(created);
  res.status(201).json(created);
});

app.delete("/videos/:id", (req, res) => {
  const id = req.params.id

  const found = videoList.find((video) => video.id === +id)

  if (!found) {
    res.status(404).json({
      errorsMessages: [
        {
          message: 'Not found',
          field: 'Id'
        }
      ]
    })
    return
  }

  const filtered = videoList.filter((video) => video.id !== +id)
  videoList = [...filtered]
  res.status(204).json({
    deleted: true
  })
});

app.delete("/all-data", (_req, res) => {
  videoList = []
  res.status(204).json({
    deleted: true
  })
})

app.put("/videos/:id", (req, res) => {
  const updates = req.body;
  const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = updates
  const id = req.params.id

  const found = videoList.find((video) => video.id === +id)

  if (!found) {
    res.status(404).json({
      errorsMessages: [
        {
          message: 'Not found',
          field: 'Id'
        }
      ]
    })
    return
  }

  const errorsMessages = []

  if (!title) {
    errorsMessages.push({ message: 'title is required', field: 'title' })
  }

  if (!author) {
    errorsMessages.push({ message: 'author is required', field: 'author' })

  }

  if (!availableResolutions || !availableResolutions.length) {
    errorsMessages.push({ message: 'availableResolutions is required', field: 'availableResolutions' })
  }

  if (availableResolutions && availableResolutions.length && !isAvailableResolutionsCorrect(availableResolutions)) {
    errorsMessages.push({ message: `availableResolutions has incorrect values, correct types are: ${RESOLUTIONS_STRING}`, field: 'availableResolutions' })
  }

  if (errorsMessages.length) {
    res.status(400).json({errorsMessages})
    return
  }

  const updated = {...found, ...updates};

  const filteredVideoList = videoList.filter((video) => video.id !== +id)
  videoList = [...filteredVideoList, updated]
  res.status(204).json(updated);
});


app.listen(PORT, () => `Server started on localhost:${PORT}`);
