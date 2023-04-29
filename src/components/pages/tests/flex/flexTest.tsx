import React, { useEffect, useRef } from 'react';
import './flexTest.scss';
import TextBasedHeader from '../../../organisms/gameplay/header/TextBasedHeader';

function FlexTest() {
  const headerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrollableHeight = () => {
        if(!headerRef.current || !topRef.current || !footerRef.current || !scrollableRef.current) return;

      const headerHeight = headerRef.current.clientHeight;
      const topHeight = topRef.current.clientHeight;
      const footerHeight = footerRef.current.clientHeight;
      const windowHeight = window.visualViewport!.height;

      const scrollableHeight = windowHeight - (headerHeight + topHeight + footerHeight);
      scrollableRef.current.style.height = `${scrollableHeight}px`;
    };

    updateScrollableHeight(); // Update on component mount
    window.addEventListener('resize', updateScrollableHeight); // Update on window resize

    return () => {
      window.removeEventListener('resize', updateScrollableHeight); // Cleanup on component unmount
    };
  }, []);

  return (
    <div className="flexTest">
       
      <div className="header"  ref={headerRef}>
      <TextBasedHeader />
      </div>
      <div className="body">
        <div className="top" ref={topRef}>
          Here is some text that is not inside the scrollable area
        </div>
        <div className="scrollable" ref={scrollableRef}>
          {Array.from(Array(100).keys()).map((i) => {
            return <div key={i}>{i}</div>;
          })}
        </div>
      </div>
      <div className="footer" ref={footerRef}>
        this is the footer
      </div>
    </div>
  );
}

export default FlexTest;