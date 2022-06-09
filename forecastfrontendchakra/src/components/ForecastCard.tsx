import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Flex,
  Heading,
  Text,
  List,
  ListItem,
} from "@chakra-ui/react";

type Props = {
  date: string;
  day: any;
};
export default function ForecastCard({ date, day }: Props) {
  return (
    <Flex
      borderRight={"1px solid black"}
      mt={6}
      borderLeft={"1px solid black"}
      key={date}
      flexDir={"column"}
    >
      <Heading>{date}</Heading>
      <List>
        <ListItem>
          <Text>{day.avgtemp_f}</Text>
        </ListItem>
      </List>
    </Flex>
  );
}
