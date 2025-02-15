import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ABTestWrapper from '../../src/ui/ABTestWrapper';
import ABTesting from '../../src/core/abTesting';

jest.mock('../../src/core/abTesting', () => ({
  getInstance: jest.fn(() => ({
    createTest: jest.fn(),
    getVariant: jest.fn(),
    trackImpression: jest.fn(),
    trackConversion: jest.fn(),
  })),
}));

describe('ABTestWrapper', () => {
  const mockABTesting = ABTesting.getInstance();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create test and get variant on mount', () => {
    (mockABTesting.getVariant as jest.Mock).mockReturnValue('Control Text');

    render(
      <ABTestWrapper
        testId="test-1"
        controlText="Control Text"
        variantText="Variant Text"
      >
        {(text) => <div>{text}</div>}
      </ABTestWrapper>
    );

    expect(mockABTesting.createTest).toHaveBeenCalledWith({
      testId: 'test-1',
      variants: ['Control Text', 'Variant Text'],
    });
    expect(mockABTesting.getVariant).toHaveBeenCalledWith('test-1');
    expect(mockABTesting.trackImpression).toHaveBeenCalledWith('test-1');
  });

  it('should render control text when variant matches control', () => {
    (mockABTesting.getVariant as jest.Mock).mockReturnValue('Control Text');

    render(
      <ABTestWrapper
        testId="test-1"
        controlText="Control Text"
        variantText="Variant Text"
      >
        {(text) => <div>{text}</div>}
      </ABTestWrapper>
    );

    expect(screen.getByText('Control Text')).toBeInTheDocument();
  });

  it('should render variant text when variant matches variant', () => {
    (mockABTesting.getVariant as jest.Mock).mockReturnValue('Variant Text');

    render(
      <ABTestWrapper
        testId="test-1"
        controlText="Control Text"
        variantText="Variant Text"
      >
        {(text) => <div>{text}</div>}
      </ABTestWrapper>
    );

    expect(screen.getByText('Variant Text')).toBeInTheDocument();
  });

  it('should track conversion on interaction', () => {
    (mockABTesting.getVariant as jest.Mock).mockReturnValue('Control Text');

    render(
      <ABTestWrapper
        testId="test-1"
        controlText="Control Text"
        variantText="Variant Text"
      >
        {(text) => <div>{text}</div>}
      </ABTestWrapper>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockABTesting.trackConversion).toHaveBeenCalledWith('test-1');
  });

  it('should handle keyboard interactions', () => {
    (mockABTesting.getVariant as jest.Mock).mockReturnValue('Control Text');

    render(
      <ABTestWrapper
        testId="test-1"
        controlText="Control Text"
        variantText="Variant Text"
      >
        {(text) => <div>{text}</div>}
      </ABTestWrapper>
    );

    const wrapper = screen.getByRole('button');

    fireEvent.keyDown(wrapper, { key: 'Enter' });
    expect(mockABTesting.trackConversion).toHaveBeenCalledWith('test-1');

    fireEvent.keyDown(wrapper, { key: ' ' });
    expect(mockABTesting.trackConversion).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(wrapper, { key: 'Tab' });
    expect(mockABTesting.trackConversion).toHaveBeenCalledTimes(2);
  });

  it('should have correct accessibility attributes', () => {
    (mockABTesting.getVariant as jest.Mock).mockReturnValue('Control Text');

    render(
      <ABTestWrapper
        testId="test-1"
        controlText="Control Text"
        variantText="Variant Text"
      >
        {(text) => <div>{text}</div>}
      </ABTestWrapper>
    );

    const wrapper = screen.getByRole('button');
    expect(wrapper).toHaveAttribute('tabIndex', '0');
    expect(wrapper).toHaveAttribute('data-testid', 'ab-test-test-1');
    expect(wrapper).toHaveAttribute('data-variant', 'control');
  });

  it('should handle test creation errors gracefully', () => {
    (mockABTesting.createTest as jest.Mock).mockImplementation(() => {
      throw new Error('Test already exists');
    });
    (mockABTesting.getVariant as jest.Mock).mockReturnValue('Control Text');

    render(
      <ABTestWrapper
        testId="test-1"
        controlText="Control Text"
        variantText="Variant Text"
      >
        {(text) => <div>{text}</div>}
      </ABTestWrapper>
    );

    expect(screen.getByText('Control Text')).toBeInTheDocument();
    expect(mockABTesting.trackImpression).toHaveBeenCalledWith('test-1');
  });
}); 