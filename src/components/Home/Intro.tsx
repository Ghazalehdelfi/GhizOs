import Image from 'next/image'
import Link from 'next/link'
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
    title: 'Sanofi',
    subtitle: 'ML Engineer',
    date: '2024—\u00a0\u00a0',
  },
  {
    href: 'https://www.sanofi.com/',
    title: 'Sanofi',
    subtitle: 'Software Engineer',
    date: '2022—24',
  },
  {
    href: 'https://www.janacorporation.com',
    title: 'JANA Corporation',
    subtitle: 'Software Engineer',
    date: '2021—22',
  },
  {
    href: 'https://kite-uhn.com',
    title: 'University Health Network | KITE Institute',
    subtitle: 'Research Assistant',
    date: '2019—21',
  },
]
const schools = [
  {
    href: 'https://bme.utoronto.ca',
    title: 'University of Toronto',
    subtitle: 'MASc | Biomedical Eng.',
    date: '2017—19',
  },
  {
    href: 'https://www.ee.sharif.ir/en/home',
    title: 'Sharif University of Technology',
    subtitle: 'BSc | Electrical Eng. + Math.',
    date: '2012—17',
  },
]

export function Intro() {
  return (
    <Detail.Container data-cy="home-intro">
      <Detail.ContentContainer>
        <div className="pb-24 sm:pt-16 space-y-8 md:space-y-16">
          <SectionContainer>
            <SectionTitle>Bio</SectionTitle>
            <SectionContent>
              <div className="flex flex-row gap-[10px]">
                <Image
                  priority
                  src="/static/img/me.jpeg"
                  width={300}
                  height={150}
                  className="rounded-2xl"
                  quality={100}
                  alt="Image of me"
                />
                <div className="prose text-primary">
                  <p>
                    Hey, I&apos;m Ghazaleh. I&apos;m a machine learning engineer
                    and a full-stack software developer. I'm passionate about
                    many things: software, mathematics, algorithms, movies and
                    art. But they can all fit under the umbrella of learning and
                    making and experiencing new things.
                  </p>
                </div>
              </div>
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
