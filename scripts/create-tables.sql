-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create paystubs table
CREATE TABLE IF NOT EXISTS public.paystubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Employee Information
  employee_name TEXT NOT NULL,
  employee_address TEXT,
  employee_ssn TEXT,
  
  -- Employer Information
  employer_name TEXT NOT NULL,
  employer_address TEXT,
  employer_ein TEXT,
  
  -- Pay Period Information
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  pay_date DATE NOT NULL,
  pay_frequency TEXT NOT NULL,
  
  -- Earnings
  hourly_rate DECIMAL(10,2),
  hours_worked DECIMAL(10,2),
  overtime_hours DECIMAL(10,2),
  overtime_rate DECIMAL(10,2),
  salary DECIMAL(10,2),
  bonus DECIMAL(10,2),
  commission DECIMAL(10,2),
  gross_pay DECIMAL(10,2) NOT NULL,
  
  -- Deductions
  federal_tax DECIMAL(10,2) DEFAULT 0,
  state_tax DECIMAL(10,2) DEFAULT 0,
  social_security DECIMAL(10,2) DEFAULT 0,
  medicare DECIMAL(10,2) DEFAULT 0,
  health_insurance DECIMAL(10,2) DEFAULT 0,
  dental_insurance DECIMAL(10,2) DEFAULT 0,
  retirement_401k DECIMAL(10,2) DEFAULT 0,
  other_deductions DECIMAL(10,2) DEFAULT 0,
  total_deductions DECIMAL(10,2) NOT NULL,
  
  -- Net Pay
  net_pay DECIMAL(10,2) NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table for payment tracking
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  paystub_id UUID REFERENCES public.paystubs(id) ON DELETE CASCADE,
  package_type TEXT NOT NULL CHECK (package_type IN ('basic', 'standard', 'premium')),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paystubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for paystubs
CREATE POLICY "Users can view own paystubs" ON public.paystubs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own paystubs" ON public.paystubs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own paystubs" ON public.paystubs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own paystubs" ON public.paystubs
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_paystubs_user_id ON public.paystubs(user_id);
CREATE INDEX IF NOT EXISTS idx_paystubs_created_at ON public.paystubs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
