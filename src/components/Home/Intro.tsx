import Image from 'next/image'
import * as React from 'react'
import { MapPin } from 'react-feather'

import Button from '~/components/Button'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'

function SectionTitle(props) {
  return (
    <h4
      className="col-span-2 pt-8 text-lg font-extrabold text-black dark:text-white md:pt-0 md:text-right md:text-base md:font-normal md:text-opacity-40"
      {...props}
    />
  )
}

function SectionContent(props) {
  return <div className="col-span-10" {...props} />
}

interface TableRowProps {
  internal?: boolean
  href: string
  title: string
  date: string
  subtitle?: string
}

function TableRow({
  internal = false,
  href,
  title,
  subtitle,
  date,
}: TableRowProps) {
  return (
    <a
      target={internal ? '_self' : '_blank'}
      rel={internal ? '' : 'noopener noreferrer'}
      href={href}
      className="flex sm:items-center flex-col sm:flex-row gap-0.5 sm:gap-4 group"
    >
      <strong className="line-clamp-2 font-medium text-gray-1000 group-hover:text-blue-600 group-hover:underline dark:text-gray-100 dark:group-hover:text-blue-500">
        {title}
      </strong>
      <span className="hidden sm:flex flex-1 border-t border-gray-300 border-dashed shrink dark:border-gray-800" />
      {subtitle && <span className="flex-none text-tertiary">{subtitle}</span>}
      {date && (
        <span className="flex-none font-mono text-quaternary">{date}</span>
      )}
    </a>
  )
}

function SectionContainer(props) {
  return (
    <div
      className="grid items-start grid-cols-1 gap-6 md:grid-cols-12"
      {...props}
    />
  )
}

const workHistory = [
  {
    href: 'https://www.sanofi.com/',
    subtitle: 'Sanofi',
    title: 'ML Engineer',
    date: '2024—\u00a0\u00a0',
  },
  {
    href: 'https://www.sanofi.com/',
    subtitle: 'Sanofi',
    title: 'Software Engineer',
    date: '2022—24',
  },
  {
    href: 'https://www.janacorporation.com',
    subtitle: 'JANA Corporation',
    title: 'Software Engineer',
    date: '2021—22',
  },
  {
    href: 'https://kite-uhn.com',
    subtitle: 'University Health Network | KITE Institute',
    title: 'Research Assistant',
    date: '2019—21',
  },
]
const schools = [
  {
    href: 'https://bme.utoronto.ca',
    subtitle: 'University of Toronto',
    title: 'MASc | Biomedical Eng.',
    date: '2017—19',
  },
  {
    href: 'https://www.ee.sharif.ir/en/home',
    subtitle: 'Sharif University of Technology',
    title: 'BSc | Electrical Eng. + Math.',
    date: '2012—17',
  },
]

export function Intro() {
  return (
    <Detail.Container data-cy="home-intro">
      <Detail.ContentContainer>
        <div className="pb-24 sm:pt-16 space-y-8 md:space-y-16">
          <Image
            src="/static/img/banner.png"
            className="rounded-2xl w-auto"
            alt="Image of me"
            width={800}
            height={400}
          />

          <SectionContainer>
            <SectionTitle>Bio</SectionTitle>
            <SectionContent>
              <div className="flex flex-row gap-[10px]">

                <div className="prose text-primary">
                  <p>
                    Hey, I&apos;m Ghazaleh. I&apos;m a machine learning engineer
                    and a full-stack software developer. My intention for this
                    website is to create a space for myself where I can exist
                    digitally. I'm interested in software development and
                    artifical intelligence. I am currently working as a ML
                    engineer and technical lead in Sanofi, a pharmacuetical
                    company with an AI-forward vision.
                  </p>
                </div>
              </div>
              <p className="prose text-primary">
                In my spare time I like to read and upskill on MLOps and data
                science and implement small projects for my own amusement. you
                can find my reading list under the bookmarks tab and some of my
                projects under the projects section. I'm currently working on
                shaping my thoughts, projects and readings into blog posts, so
                stay tuned for that!
              </p>
            </SectionContent>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Where</SectionTitle>
            <SectionContent>
              <p className="flex items-center space-x-2 text-quaternary md:text-right">
                <MapPin size={12} />
                <span>Toronto, CA</span>
              </p>
            </SectionContent>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Work</SectionTitle>
            <SectionContent>
              <div className="flex flex-col space-y-3">
                {workHistory.map((job) => (
                  <TableRow
                    href={job.href}
                    title={job.title}
                    subtitle={job.subtitle}
                    date={job.date}
                    key={job.href}
                  />
                ))}
              </div>
            </SectionContent>
          </SectionContainer>
          <SectionContainer>
            <SectionTitle>Study</SectionTitle>
            <SectionContent>
              <div className="flex flex-col space-y-3">
                {schools.map((job) => (
                  <TableRow
                    href={job.href}
                    title={job.title}
                    subtitle={job.subtitle}
                    date={job.date}
                    key={job.href}
                  />
                ))}
              </div>
            </SectionContent>
          </SectionContainer>
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
