import React from "react"
import { Card, Tag, Skeleton, Button, Typography } from "antd"
import { FiClock, FiTrash2 } from "react-icons/fi"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const { Text } = Typography

const MyStoriesWidget = ({ stories, isLoading, onDelete, isDeleting }) => {
  return (
    <Card
      className="rounded-2xl border-transparent shadow-sm"
      title={
        <div className="flex items-center gap-2">
          <span className="font-bold">My Active Stories</span>
          <Tag
            color="red"
            className="rounded-full border-none bg-red-50 text-[#990011]"
          >
            {stories.length}
          </Tag>
        </div>
      }
      variant="borderless"
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : stories.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          <p>No active stories</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {stories.map((story) => (
            <div
              key={story.storyId}
              className="flex flex-col gap-1 py-4 border-b border-gray-100 last:border-0 first:pt-0"
            >
              <div className="flex w-full items-start justify-between gap-2">
                <Text className="line-clamp-2 break-words font-medium text-gray-800">
                  {story.storyContent}
                </Text>
                <Button
                  danger
                  type="text"
                  icon={<FiTrash2 />}
                  onClick={() => onDelete(story.storyId)}
                  loading={isDeleting}
                  className="-mr-2 -mt-1"
                />
              </div>
              <Text
                type="secondary"
                className="flex items-center gap-1 text-xs"
              >
                <FiClock /> Expires {dayjs(story.expiresAt).fromNow()}
              </Text>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default MyStoriesWidget
