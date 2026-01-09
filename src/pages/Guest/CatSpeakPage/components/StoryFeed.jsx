import React from "react"
import { Card, Avatar, Button, Typography } from "antd"
import { FiClock, FiMessageCircle, FiX } from "react-icons/fi"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const { Text, Paragraph, Title } = Typography

const StoryFeed = ({ stories, isLoading, onInteract }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            loading
            variant="borderless"
            className="rounded-2xl shadow-sm"
          />
        ))}
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
        <div className="mb-4 text-6xl">📭</div>
        <h3 className="mb-2 text-xl font-bold text-gray-800">
          It's quiet here
        </h3>
        <p className="text-gray-500">Be the first to share a story!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {stories.map((story) => (
        <Card
          key={story.storyId}
          className="overflow-hidden rounded-2xl border-transparent shadow-sm transition-shadow hover:shadow-md"
          bordered={false}
        >
          <div className="flex items-start gap-4">
            <Avatar
              size={48}
              src={story.avatarImageUrl}
              className="bg-[#990011]"
              icon={
                !story.avatarImageUrl && <span className="text-lg">👤</span>
              }
            >
              {story.username?.[0]}
            </Avatar>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <Text strong className="text-lg">
                  {story.username || "Anonymous User"}
                </Text>
                <Text
                  type="secondary"
                  className="flex items-center gap-1 text-xs"
                >
                  <FiClock /> {dayjs(story.createDate).fromNow()}
                </Text>
              </div>

              <Paragraph className="whitespace-pre-wrap text-base text-gray-700">
                {story.storyContent}
              </Paragraph>

              <div className="mt-4 flex items-center gap-3">
                <Button
                  type="primary"
                  shape="round"
                  icon={<FiMessageCircle />}
                  onClick={() => onInteract(story.storyId, 1)}
                  className="bg-[#990011] hover:!bg-[#7a000d]"
                >
                  Connect
                </Button>
                <Button
                  type="text"
                  shape="round"
                  icon={<FiX />}
                  onClick={() => onInteract(story.storyId, 0)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  Pass
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default StoryFeed
