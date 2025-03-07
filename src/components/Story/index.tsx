import Image from 'next/image'
import { useState } from 'react'

import { Detail } from '~/components/ListDetail/Detail'

import { LoadingSpinner } from '../LoadingSpinner'

interface BookPage {
  content?: string
  image?: string
}

interface BookDetails {
  title: string
  pages: BookPage[]
}

const StoryGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [book, setBook] = useState<BookDetails | null>(null)
  const [loadingStory, setLoadingStory] = useState(false)
  const [loadingImages, setLoadingImages] = useState(false)
  const [error, setError] = useState(false)

  const generateStory = async () => {
    setLoadingStory(true)
    setError(false)

    try {
      // Step 1: Fetch the story from the API
      const storyRes = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!storyRes.ok) throw new Error('Failed to generate story')

      const { story } = await storyRes.json()
      const bookDetails: BookDetails = {
        title: title,
        pages: [],
      }
      setLoadingImages(true)
      const paragraphs = story.split('\n\n')
      for (const paragraph of paragraphs) {
        const [content, summary] = paragraph.split('(Summary:')
        bookDetails.pages.push({ content: content.trim() })

        if (summary) {
          // Step 2: Fetch image for the paragraph
          const imageRes = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: summary.trim() }),
          })

          if (imageRes.ok) {
            const { imageUrl } = await imageRes.json()
            bookDetails.pages.push({ image: imageUrl })
          }
        }
      }

      setBook(bookDetails)
    } catch (error) {
      console.error(error)
      setError(true)
    } finally {
      setLoadingStory(false)
      setLoadingImages(false)
    }
  }

  return (
    <Detail.Container data-cy="home-intro">
      <Detail.ContentContainer>
        <h1 className="text-2xl font-xlarge text-gray-1000 dark:text-gray-100 mb-5">
          AI Storytime
        </h1>
        <div className="flex justify-center">
          <Image
            priority
            src="/static/img/story.webp"
            width={700}
            height={100}
            className="rounded-2xl j"
            quality={100}
            alt="Story telling wizard"
          />
        </div>
        <p className="prose text-primary mb-5 w-full">
          Welcome to AI storytime! The idea behind this project is to create
          complete story books in a matter of minutes purely out of AI. I use
          chatGPT to get the stories and Dall.E to create the illustrations. Try
          it and create your personalized storybooks with a simple prompt.
        </p>

        <div className="flex flex-col gap-3 text-gray-1000 dark:text-gray-100">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of your story ..."
            className="p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the story line .."
            className="p-3 border rounded-lg focus:ring focus:ring-blue-300"
          />

          <button
            onClick={generateStory}
            disabled={loadingStory || loadingImages}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loadingImages ? (
              <div className="flex flex-row items-center gap-[10px]">
                <LoadingSpinner /> Generating Illustrations
              </div>
            ) : loadingStory ? (
              <div className="flex flex-row items-center gap-[10px]">
                <LoadingSpinner /> Generating Story
              </div>
            ) : (
              'Generate Story'
            )}
          </button>
        </div>

        {error && (
          <p className="text-red-500 mt-4 text-center">
            Something went wrong. Try again.
          </p>
        )}

        {book && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-100">
            <h2
              className="text-[40px] text-center"
              style={{ fontFamily: 'Beyond Wonderland' }}
            >
              {book.title}
            </h2>

            {book.pages.map((page, index) => (
              <div key={index} className="mt-4">
                {page.content && <p className="text-lg">{page.content}</p>}
                {page.image && (
                  <img
                    src={page.image}
                    alt={`Illustration ${index}`}
                    className="w-full h-auto rounded-lg mt-2"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </Detail.ContentContainer>
    </Detail.Container>
  )
}

export default StoryGenerator
