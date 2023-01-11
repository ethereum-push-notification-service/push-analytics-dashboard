// React, NextJS imports
import React from 'react';

// External Library imports
import { useTheme } from 'styled-components';
import { useMediaQuery } from '@mui/material';

// Internal Components imports
import { OverviewItem } from './overview.styled';
import { Text } from '../../dashboard.styled';
import { getChats, getUsers, getNotifications } from '../../../../utils/api';
import { useData } from '../../../../contexts/DataContext';
import { HorizontalLine } from '../../dashboard.styled';
import {
  ItemHV2,
  ItemVV2,
  ImageV2,
} from '../../../../components/SharedStyling';

export default function OverViewSet() {
  const { pushIntegrations } = useData();
  const isMobile = useMediaQuery('(max-width:480px)');
  const [chatUsers, setChatUsers] = React.useState<number>(0);
  const [chatSent, setChatSent] = React.useState<number>(0);
  const [notifiactionsSent, setNotificationsSent] = React.useState<number>(0);

  const overViewData = [
    {
      image: './static/push-integration.svg',
      title: 'Push Integrations',
      value: pushIntegrations,
      size: 60,
    },
    {
      image: './static/chat-sent.svg',
      title: 'Chat Sent',
      value: chatSent,
      size: 51,
    },
    {
      image: './static/chat-user.svg',
      title: 'Chat Users',
      value: chatUsers,
      size: 65,
    },
    {
      image: './static/notifications.svg',
      title: 'Notifications Sent',
      value: notifiactionsSent,
      size: 41,
    },
  ];
  const theme = useTheme();

  React.useEffect(() => {
    (async () => {
      let total = 0;
      const chatResponse = await getChats();
      setChatSent(chatResponse?.totalMessages);

      const userResponse = await getUsers();
      setChatUsers(userResponse?.totalUsers);

      const notificationResponse = await getNotifications({
        startDate: new Date('2022-01-01'),
        endDate: new Date(),
        channel: 'All',
        chain: 'ETH_MAINNET',
      });
      const notifictionAnalyticsData =
        notificationResponse?.notificationAnalytics;

      for (let i = 0; i < notifictionAnalyticsData?.length; i++) {
        for (let key in notifictionAnalyticsData[i]) {
          if (key === 'date') {
            continue;
          } else {
            total += notifictionAnalyticsData[i][key]?.notification;
          }
        }
      }
      setNotificationsSent(total);
    })();
  }, []);

  return (
    <>
      <ItemVV2
        width="100%"
        margin={isMobile ? '25px 0px 30px' : '50px 0px 30px'}
        alignItems="flex-start"
      >
        <Text size="18px" weight={400} marginBottom="20px">
          Overview
        </Text>
        <ItemHV2
          width="100%"
          gap="23px"
          justifyContent="space-between"
          marginTop="20px"
        >
          {overViewData.map((data) => (
            <OverviewItem
              key={data.title}
              style={{
                backgroundColor: theme.background.card,
                border: `1px solid ${theme.background.border}`,
                height: '114px',
              }}
            >
              <ItemVV2 alignItems="flex-start" justifyContent="center">
                <Text size="18px" weight={500}>
                  {data.title}
                </Text>

                <Text size="36px" weight={500}>
                  {data.value?.toLocaleString()}
                </Text>
              </ItemVV2>
              <ImageV2 src={data.image} width={data.size} height={data.size} />
            </OverviewItem>
          ))}
        </ItemHV2>
      </ItemVV2>
      <HorizontalLine />
    </>
  );
}
