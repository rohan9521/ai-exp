import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Post = styled.div`
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 4px;
`;

const Feed = () => {
  return (
    <Container>
      <h2>Feed</h2>
      {/* Add feed content here */}
      <Post>
        <img src='https://via.placeholder.com/150' alt='Placeholder Image' />
        <p>Photo or Video description</p>
      </Post>
    </Container>
  );
};

export default Feed;