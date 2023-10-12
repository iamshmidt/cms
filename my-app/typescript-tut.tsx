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
// Create a type with three string fields 
//The Record type is a way to build a new type with several members of a single type. For example, if you need an object with three members of type string, you could do it like 
type RecordType1 = Record<"m1" | "m2" | "m3", string>;
// Instantiate a variable from the type
const x: RecordType1 = { m1: "s1", m2: "s2", m3: "s3"};
console.log(x);

// An interface with many fields of many types
interface Animal {
  age: number;
  name: string;

  maximumDeepness: number;

  numberOfLegs: number;
  canSwim: boolean;
  runningSpeed: number;
}

// A function that need to take all the animal fields but from a string type
function receiveInputFromUser(dataIn: Record<keyof Animal, string>): Animal{
  const wellTypedObject: Animal = {
      age: Number(dataIn.age),
      name: dataIn.name,
      maximumDeepness: Number(dataIn.maximumDeepness),
      numberOfLegs: Number(dataIn.numberOfLegs),
      canSwim: Boolean(dataIn.age),
      runningSpeed: Number(dataIn.runningSpeed),
  }
  return wellTypedObject;
}
console.log(receiveInputFromUser({
  age: "13",
  name:"Fish",
  numberOfLegs: "2",
  maximumDeepness : "123",
  canSwim : "true",
  runningSpeed : "0"
}));



// Omit takes everything except the member selected. 
interface Animal {
  age: number;
  name: string;

  maximumDeepness: number;

  numberOfLegs: number;
  canSwim: boolean;
  runningSpeed: number;
}

// Parameter using Omit to remove three fields
function buyAFish(fishEntity: Omit<Animal, "numberOfLegs" | "canSwim" | "runningSpeed" >) {
  console.log(fishEntity);
}

buyAFish({
  age: 1,
  name: "Clown Fish",
  maximumDeepness: 10,
});


// Extract 
interface Animal {
  name: string;
  sound: string;
}
interface Human {
  name: string;
  nickname: string;
}

type LivingThing = Extract<keyof Animal, keyof Human>;
function sayMyName(who: Record<LivingThing, string>): void {
  console.log(who.name);
}
const animal: Animal = { name: "Lion", sound: "Rawwwhhh" };
const human: Human = { name: "Jacob", nickname: "Jaco-bee" };
sayMyName(animal);
sayMyName(human);
//Output
// Lion
// Jacob

// Adding a property conditionally
interface Person {
  name: string;
  dateCreated: Date;
}
interface Animal {
  name: string;
}

// Create a generic Type that add modifiedDate only if dateCreated is present
type Modified<T> = T extends { dateCreated: Date } ? T & { modifiedDate: Date } : never;

const p: Person = { name: "Pat", dateCreated: new Date() };
const a: Animal = { name: "Jack" };

// ModifiedDate present because "Person" has dateCreated
const p2: Modified<Person> = { ...p, modifiedDate: new Date() }; 
console.log(p2.modifiedDate)

// Following line do not transpile because Animal does not have dateCreated
// const a2: Modified<Animal> = { ...p, modifiedDate: new Date() };
// console.log(a2.modifiedDate)

// The tuple type is an array of defined elements. To declare a tuple, you use square brackets
let numberTuple: [number, number, number];

type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // A === true
type B = IsString<"abc">; // B === true
type C = IsString<123>; // C === false

// intersection types &
type A_and_B_and_C = A & B & C;

// union types
type A_or_B_or_C = A | B | C;

// generic types
function firstElement<T>(arr: T[]): T {
  return arr[0];
}

let strArr = ["a", "b", "c"];
let numArr = [1, 2, 3];

let firstStr: string = firstElement(strArr);  // string
let firstNum: number = firstElement(numArr);  // number

// Generic Constraints
interface Dictionary<T> {
  [key: string]: T;
}

let userRoles: Dictionary<number> = {
  'admin': 1,
  'user': 2,
  'guest': 3
};

// Argumant constraints
interface FormField<T extends string | number | boolean> {
  value?: T;
  defaultValue: T;
  isValid: boolean;
}

// Type 'T' does not satisfy the constraint 'string | number | boolean'
function getFieldValue<T extends string | number>(field: FormField<T>): T {
  return field.value ?? field.defaultValue;
}


// generalize the getIds function so that it works on any collection of objects that have the id property.
function getIds<T extends Record<'id', string>>(elements: T[]) {
  return elements.map(el => el.id);
}

