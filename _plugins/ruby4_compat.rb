# Ruby 3.2+ removed taint APIs, but older Liquid code still calls them.
class Object
  def taint
    self
  end unless method_defined?(:taint)

  def untaint
    self
  end unless method_defined?(:untaint)

  def tainted?
    false
  end unless method_defined?(:tainted?)
end
