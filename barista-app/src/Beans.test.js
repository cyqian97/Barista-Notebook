import { render, screen } from '@testing-library/react';
import Beans from './Beans';

test('renders learn react link', () => {
  render(<Beans />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
