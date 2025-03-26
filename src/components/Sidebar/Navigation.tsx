import { useRouter } from 'next/router'
import * as React from 'react'

import {
  AppDissectionIcon,
  BookmarksIcon,
  ExternalLinkIcon,
  GitHubIcon,
  HomeIcon,
  LetterBoxdIcon,
  LinkedInIcon,
  StackIcon,
  WritingIcon,
} from '~/components/Icon'

import { NavigationLink } from './NavigationLink'

export function SidebarNavigation() {
  const router = useRouter()
  const sections = [
    {
      label: null,
      items: [
        {
          href: '/',
          label: 'Home',
          icon: HomeIcon,
          trailingAccessory: null,
          isActive: router.asPath === '/',
          trailingAction: null,
          isExternal: false,
        },

        {
          href: '/writing',
          label: 'Writing',
          icon: WritingIcon,
          trailingAccessory: null,
          isActive: router.asPath.indexOf('/writing') >= 0,
          trailingAction: null,
          isExternal: false,
        },
      ],
    },
    {
      label: 'Me',
      items: [
        {
          href: '/bookmarks',
          label: 'Bookmarks',
          icon: BookmarksIcon,
          trailingAccessory: null,
          isActive: router.asPath.indexOf('/bookmarks') >= 0,
          trailingAction: null,
          isExternal: false,
        },

        {
          href: '/stack',
          label: 'Stack',
          icon: StackIcon,
          trailingAccessory: null,
          isActive: router.asPath.indexOf('/stack') >= 0,
          trailingAction: null,
          isExternal: false,
        },
      ],
    },
    {
      label: 'Projects',
      items: [
        {
          href: '/story',
          label: 'StoryBook AI',
          icon: AppDissectionIcon,
          trailingAccessory: null,
          isActive: router.asPath.indexOf('/app-dissection') >= 0,
          trailingAction: null,
          isExternal: false,
        },
        {
          href: '/projects/personal-finances',
          label: 'Personal Finances',
          icon: AppDissectionIcon,
          trailingAccessory: null,
          isActive: router.asPath.indexOf('/projects/personal-finances') >= 0,
          trailingAction: null,
          isExternal: false,
        },
      ],
    },
    {
      label: 'Online',
      items: [
        {
          href: 'https://www.linkedin.com/in/ghazalehdelfi/',
          label: 'LinkedIn',
          icon: LinkedInIcon,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
        {
          href: 'https://github.com/Ghazalehdelfi',
          label: 'GitHub',
          icon: GitHubIcon,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
        {
          href: 'https://letterboxd.com/ghizd/',
          label: 'Letterboxd',
          icon: LetterBoxdIcon,
          trailingAccessory: ExternalLinkIcon,
          isActive: false,
          trailingAction: null,
          isExternal: true,
        },
      ],
    },
  ]

  return (
    <div className="flex-1 px-3 py-3 space-y-1">
      {sections.map((section, i) => {
        return (
          <ul key={i} className="space-y-1">
            {section.label && (
              <h4
                key={i}
                className="px-2 pt-5 pb-2 text-xs font-semibold text-gray-1000 text-opacity-40 dark:text-white"
              >
                {section.label}
              </h4>
            )}
            {section.items.map((item, j) => (
              <NavigationLink key={j} link={item} />
            ))}
          </ul>
        )
      })}
    </div>
  )
}
