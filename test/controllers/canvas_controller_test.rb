require 'test_helper'

class CanvasControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get canvas_new_url
    assert_response :success
  end

end
