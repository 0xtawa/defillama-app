import Layout from '../layout'
import styled from 'styled-components'
import { revalidate } from 'utils/dataApi'
import Telegram from '../assets/telegram.svg'
import Image from 'next/image'
import Link from 'next/link'

const Header = styled.h1`
  color: ${({ theme }) => theme.text1};
  font-weight: 600;
  margin: 0;
  font-size: revert !important;

  a {
    position: relative;
    top: 4px;
  }
`

const Text = styled.p`
  color: ${({ theme }) => theme.text1};
  white-space: pre-line;
  line-height: 1.5rem;
  font-size: 1rem;
  word-break: break-all;

  a {
    color: inherit;
  }
`

const Message = ({ text }: { text: string }) => {
  return (
    <>
      {text.includes('http') ? (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ) : (
        text
      )}
      <br />
    </>
  )
}

export default function Chains({ messages }) {
  const splitText = messages.split('\n')

  return (
    <Layout title={`Daily Roundup - DefiLlama`} defaultSEO>
      <span style={{ margin: '0 auto' }}>
        <Header>
          Daily news round-up with the 🦙 on{' '}
          <Link href="https://t.me/defillama_tg" passHref>
            <a target="_blank" rel="noopener noreferrer">
              <Image src={Telegram} alt="Join our telegram" height={28} width={24} />
            </a>
          </Link>
        </Header>
        <Text>
          {splitText.map((m, index) => (
            <Message text={m} key={m + index} />
          ))}
        </Text>
      </span>
    </Layout>
  )
}

export async function getStaticProps() {
  const headers = new Headers()
  headers.append('Authorization', `Bot ${process.env.ROUND_UP_BOT_TOKEN}`)

  let data = []

  const response = await fetch('https://discordapp.com/api/channels/965023197365960734/messages', {
    method: 'GET',
    headers: headers,
    redirect: 'follow',
  })

  if (response.ok) {
    data = await response.json()
  }

  const index = data.findIndex((d) => d.content.startsWith('Daily news round-up with the')) ?? null

  const raw = Number.isNaN(index) ? [] : data.slice(0, index + 1)

  const messages = raw
    .reverse()
    .map((m) => m.content)
    .join('')

  const splitLlama = messages.split('Daily news round-up with the 🦙')

  return {
    props: {
      messages: splitLlama[1] || null,
    },
    revalidate: revalidate(),
  }
}
