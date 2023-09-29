import React, { ComponentProps, ComponentPropsWithRef, ComponentPropsWithoutRef, useRef, useState } from 'react';

"use client"
function Home() {

  const [count, setCount] = useState(0);
  const onClick = (test: string) => {
    return 5;
  }
  return (
    <main className="min-h-screen flex justify-center">
      <Button setCount={setCount} onClick={onClick} backgroundColor="red" padding={[5, 10, 29]}></Button>
      <ButtonStyle borderRadius={{
        'top-left': '5px',
        'top-right': '5px',
        'bottom-left': '10px',
        'bottom-right': '10px'
      }}
        style={{
          backgroundColor: 'red',
          fontSize: '14px',
          color: "white"
        }} >Children here</ButtonStyle>
    </main>
  );
}
type Color = "red" | "blue" | "green";
type ButtonProps = {
  backgroundColor: Color;
  fontSize?: string
  pillShape?: boolean
  padding: number[]
  // onClick?: () => void; // Function type, if function doesn't return anything - use void;
  onClick: (test: string) => number; // Function type, if function returns something - specify the type of props returned;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}


export function Button({
  backgroundColor,
  fontSize,
  pillShape,
  padding,
  onClick,
  setCount
}: ButtonProps) {
  return (
    setCount(5),
    <button onClick={() => onClick('test')} className={`rounded-lg px-4 py-2 text-white`} style={{ backgroundColor }}>
      Click me!
    </button>
  );
}

type ButtonStylesProps = {
  style: React.CSSProperties,
  borderRadius: Record<string, number>,
  children: React.ReactNode // ReactNode is a type that accepts any valid React child: number, string, element or an array use JSX.Element for strict React Elements (no text o numbers allowed)
}

//  we can use alies for types
interface IButtonStylesProps {
  style: React.CSSProperties,
  borderRadius: Record<string, number>,
  children: React.ReactNode
}

//  with interface you can only describe objects


export default function ButtonStyle({
  style,
  borderRadius,
  children
}: ButtonStylesProps) {

  const buttonStyle: React.CSSProperties = {
    ...style, // Preserve existing styles
    borderRadius: `${borderRadius}px`, // Apply border radius
  };



  return (
    <button style={buttonStyle}>{children}</button>
  );
}


//  example of using type:
type Person = {
  name: string;
  age: number;
};

const john: Person = {
  name: 'John Doe',
  age: 30
};

// example of using interface:
interface Person2 {
  name: string;
  age: number;
}

const jane: Person2 = {
  name: 'Jane Smith',
  age: 25
};



function UseBtn() {

  return (
    <main className="min-h-screen flex justify-center">
      <ButtonComponent type='submit' autoFocus={true} defaultValue="test" className='test'></ButtonComponent>
    </main>
  );
}



type ButtonComponentProps = ComponentPropsWithoutRef<'button'> & {
  variant?: "primary" | "secondary"; // optional prop
};
// type ButtonComponentProps = ComponentProps<'button'>;

// customizable ButtonComponent
const ButtonComponent: React.FC<ButtonComponentProps> = ({
  type,
  autoFocus,
  ...rest // rest prop will contain all the props that are not destructured, we are passing thes defaultValue="test" className='test', but it is not destructured
}) => {
  return (
    <div>
      <button type={type} autoFocus={autoFocus} {...rest}>Click me!</button>
    </div>
  );
}



// Another BUTTON EXAMPLE
type ButtonComponentPropsEx = {
  type: "submit" | "button" | "reset" | undefined,
  color: "primary" | "secondary" | "default" | undefined,
}
// type ButtonComponentProps = ComponentProps<'button'>;

type SuperButtonProps = ButtonComponentPropsEx & {
  size: "small" | "medium" | "large";
}

// customizable ButtonComponent
const ButtonEx: React.FC<SuperButtonProps> = ({
  type,
  color,
  size,
}) => {
  return (
    <div>
      <button>Click me!</button>
    </div>
  );
}



function UseBtnEx() {

  return (
    <main className="min-h-screen flex justify-center">
      <ButtonEx type="submit" color="primary" size="large"></ButtonEx>
    </main>
  );
}

// BUTTON EVENT

const ButtonEvents = () => {
  const [count, setCount] = useState(0);// if you want to specify the type, you should write something like this: const [count, setCount] = useState<number>(0);
  //const [count, setCount] = useState<number>(0);

  type User = {
    name: string;
    age: number;
  }

  const [user, setUser] = useState<User | null>(null)
  const name= user?.name ?? 'No name';

  const ref =  useRef<HTMLButtonElement>(null); 

  const buttonTextOptions = [
    'Click me!',
    'Click me again!',
    'Click me one more time!',
    'Click me, please!',
    'Click me, I beg you!'
  ] as const;


  type User2 = {
    sessionId: string;
    name: string
  }
    // when we need user object but have to exclude "name" property
  type Guest = Omit<User2, 'name'>;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!', event);
  };


  // GENERIC TYPES
  const convertToArray =<T,>(value:T): T[]=>{
    return [value];
  }

  function convertToArray2<T>(value: T): T[] {
    return [value];
  }

  convertToArray(5);
  convertToArray('test');

  return (
    <button ref={ref} onClick={handleClick}>{buttonTextOptions.map((option)=> {
      return option;
    })}</button>
  );
}
